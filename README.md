This is a VERY basic, rough and ready demo of integrating Django and Vue into a single page application.

It is not meant for production, but just provides some starting points for building a real-world project. It's lacking a lot of things that would make it so such as Docker (or other deployment/containerization system), backend or frontend unit and integration tests, etc etc. While I have provided some ideas here on how to build a secure application, this has not been tested "in the wild" and any risk in using this code is your own.

One impetus for doing this is the lack of good examples out there in building a secure appliction. Most of the time, examples and tutorials use DRF auth tokens (and sometimes JWT) and storing the token(s) in localStorage. Perhaps this is OK for a toy app, but doing so without care and caveats opens up your application to XSS attacks. JWT is probably best suited for mobile and server-to-server API calls, but not for web browsers. I admit this is a controversial opinion, but current OWASP guidelines [1] recommend against storing authentication data in localStorage, sessionStorage and client-side cookies.

Short of using an external service (e.g. Auth0), what is best practice for securing a Django/DRF-backed SPA? I would argue the same best practices you would follow in building a traditional server-rendered Django project: HttpOnly cookies along with CSRF protection for "write" endpoints (along with other best practices such as always using HTTPS, using SameSite cookie settings etc etc).

Using DRF this is relatively straightforward: use SessionAuthentication. There is a problem however if you want to login or signup: SessionAuthentication applies CSRF only to authenticated users. There are perhaps good reasons for this, but it means that just adding some "login" or "signup" endpoints to your API will not be sufficient to prevent a serious attack vector.

Another point: I would like to use django_allauth for authentication as opposed to Django auth views. Allauth provides more options and out-of-the-box functionality I would like to leverage.

The official DRF recommendations for SessionAuthentication however recommend using plain auth views (or by extension, allauth or other functionality based on Django's auth system). However, django_allauth supports AJAX views out of the box (albeit with plain form submission parameters instead of JSON data). The allauth AJAX views return JSON, including fields and errors (they also include "html" i.e. the rendered HTML template: you can ignore this, but for completion there is a custom adapter that skips this generation for efficiency). These are plain Django views i.e. requiring CSRF which is set up in axios. Once you are authenticated, all DRF POST/PUT/DELETE etc will use CSRF through SessionAuthentication.

The basic architecture works like this:

1. We have a Django TemplateView as the "default page" for our application. Any other Django URLs (DRF API routes, allauth, admin) must go before this view.  It has a wildcard to ensure that any other URLs are managed client-side with vue-router, so if for example I enter "http://mysite.com/login" as my URL it will automatically show the login page instead of a 404.
2. The default page is pretty much a standard view. It is wrapped in the ensure_csrf_cookie decorator to make sure that when the user navigates to the page, a CSRF cookie will always be added.
3. In addition to the CSRF cookie, we want to render a Django template. This template injects anything we want to include in our Vue SPA on page load. For example, we want to know if a user is logged in, and the details of that user needed for the application (i.e. request.user). The user is serialized and added into the page using the json_script template filter, which allows the Vue SPA to just load and parse that tag at startup. This is very useful as it simplifies and speeds up the loading process: we can hydrate our Vuex store synchronously on initial load rather than wait for one or more API calls to provide the initial data.
4. Note that the Django template (index.html) is not located under "templates" as in a common Django app. Vue cli instead looks in the "dist" directory when building the assets and adds all the required paths to the assets (e.g. JS and CSS bundles) to that template. This lets Vue/Webpack inject all the required assets and other info into the template, and Django inject the request-time info needed to hydrate the SPA.
5. So: vue-cli injects the correct paths into a Django template. You just navigate to your Django app (http://localhost:8000 or whatever the production URL is) and the template with all the ready links will just work. However there is a caveat: in development, the hot-loader service won't work. Instead we remove that and use the "watch"
service to rebuild immediately when a file is changed. This isn't as slick as hot-reloading but not sure of a way around this trade-off without adding inconsistency and complexity to the workflow (i.e. things not quite working the same way in production, being able to hydrate and access the CSRF token etc). I'm happy with the tradeoff as I often find myself doing a full refresh on edit anyway, but others might find it annoying.
6. I've used whitenoise for ease of development and deployment. The vue config should probably be set up to inject the URL for your CDN (e.g. Cloudfront) as an environment variable in your pipeline, and you then configure your CDN to point the domain back to your app. Please consult the Vue and whitenoise docs for more details.
7. Because everything is just served under one domain, as one application, you don't need CORS.

My aim is to be able to leverage all the advantages of Django and its ecosystem: the ORM, Rest Framework, tried-and-tested security - with the advantages of Vue and its ecosystem - components, fast turnaround, good performance and so on. I wasn't willing however to compromise on security for the sake of DX and the oft-quoted practice of "just use localStorage for your auth tokens" seemed a bit fishy in the face of expert recommendations.

I did look at django-webpack-loader. I found it a bit awkward for a number of reasons: development seemed quite slow and wasn't up to date with the latest Webpack updates (this may have since changed); and the need to have the extra step of tracking all the paths in a manifest looked like it would require more Webpack hacking and patching than I was comfortable with, sacrificing much of the ease of use provided by vue-cli and causing headaches for a CI/CD pipeline.

What about a multi-page setup? I've not tried it but this might work: https://cli.vuejs.org/config/#pages. So you map the pages to Django templates in the same way as the single index.html, and have different Django views serve up those pages. Alternatively, you could just use the generic single template and inject different JSON loads at startup (maybe namespacing to easily sync with Vuex). This might work better where you don't have an SPA but instead "mini-applications" along with static content. If you need actual static content for SEO purposes you can of course just serve up plain Django views or pregenerated HTML static pages. There are different use cases and no one size fits all.

CREDITS

This repo provided a lot of useful pointers, particularly in setting up Django template with Vue:

https://github.com/gtalarico/django-vue-template


LINKS
[1] https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/HTML5_Security_Cheat_Sheet.md#local-storage
