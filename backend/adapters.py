from django.http import JsonResponse
from allauth.account.adapter import DefaultAccountAdapter


class CustomAccountAdapter(DefaultAccountAdapter):
    def ajax_response(self, request, response, redirect_to=None, form=None, data=None):
        resp = {}
        status = response.status_code

        if redirect_to:
            status = 200
            resp["location"] = redirect_to
        if form:
            if request.method == "POST":
                if form.is_valid():
                    status = 200
                else:
                    status = 400
            else:
                status = 200
            resp["form"] = self.ajax_response_form(form)
            if data is not None:
                resp["data"] = data
        return JsonResponse(resp, status=status)
