from django.shortcuts import render
from django.http import HttpResponse, Http404


def home(request):
    # fetch any data required

    # render the template
    return render(request, 'build/index.html')
