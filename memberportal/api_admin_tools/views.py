from profile.models import User
from access import models as access_models
from access import models
from constance import config
from profile.emailhelpers import send_single_email
import requests
import time

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from django.db import connection, reset_queries


class GetMembers(APIView):
    """
    get: This method returns a list of members.
    """

    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        reset_queries()
        start_queries = len(connection.queries)

        start_time = time.time()
        members = User.objects.select_related("profile", "profile__member_type").all()
        # doors = access_models.Doors.objects.filter(hidden=False)
        # interlocks = access_models.Interlock.objects.filter(hidden=False)

        filtered = []

        for member in members:
            filtered.append(member.profile.get_basic_profile())

        print(time.time() - start_time)

        end_queries = len(connection.queries)
        print(f"Number of Queries : {end_queries - start_queries}")

        return Response(filtered)


class MemberState(APIView):
    """
    get: This method gets a member's state.
    post: This method sets a member's state.
    """

    permission_classes = (permissions.IsAdminUser,)

    def get(self, request, member_id, state=None):
        member = User.objects.get(id=member_id)

        return Response({"state": member.profile.state})

    def post(self, request, member_id, state):
        member = User.objects.get(id=member_id)
        if state == "active":
            member.profile.activate(request)
        elif state == "inactive":
            member.profile.deactivate(request)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response()


class MakeMember(APIView):
    """
    post: This activates a new member.
    """

    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, member_id):
        user = User.objects.get(id=member_id)
        if user.profile.state == "noob":
            # give default door access
            for door in models.Doors.objects.filter(all_members=True):
                user.profile.doors.add(door)

            # give default interlock access
            for interlock in models.Interlock.objects.filter(all_members=True):
                user.profile.interlocks.add(interlock)

            email = user.email_welcome()
            xero = user.profile.add_to_xero()
            invoice = user.profile.create_membership_invoice()
            user.profile.state = (
                "inactive"  # an admin should activate them when they pay their invoice
            )
            user.profile.save()

            if "Error" not in xero and "Error" not in invoice and email:
                return Response(
                    {"success": True, "message": "adminTools.makeMemberSuccess",}
                )

            elif "Error" in xero:
                return Response({"success": False, "message": xero})

            elif "Error" in invoice:
                return Response({"success": False, "message": invoice})

            elif email is False:
                return Response(
                    {"success": False, "message": "adminTools.makeMemberErrorEmail"}
                )

            else:
                return Response(
                    {"success": False, "message": "adminTools.makeMemberError",}
                )
        else:
            return Response(
                {"success": False, "message": "adminTools.makeMemberErrorExists",}
            )


class Doors(APIView):
    """
    get: This method returns a list of doors.
    """

    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        doors = models.Doors.objects.all()

        def get_door(door):
            return {
                "name": door.name,
                "lastSeen": door.last_seen,
                "ipAddress": door.ip_address,
            }

        return Response(map(get_door, doors))


class Interlocks(APIView):
    """
    get: This method returns a list of interlocks.
    """

    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        interlocks = models.Interlock.objects.all()

        def get_door(interlock):
            return {
                "name": interlock.name,
                "lastSeen": interlock.last_seen,
                "ipAddress": interlock.ip_address,
            }

        return Response(map(get_door, interlocks))


class MemberAccess(APIView):
    """
    get: This method gets a member's access permissions.
    """

    permission_classes = (permissions.IsAdminUser,)

    def get(self, request, member_id):
        member = User.objects.get(id=member_id)

        return Response(member.profile.get_access_permissions())


class MemberWelcomeEmail(APIView):
    """
    get: This method sends a welcome email to the specified member.
    """

    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, member_id):
        member = User.objects.get(id=member_id)
        member.email_welcome()

        return Response()
