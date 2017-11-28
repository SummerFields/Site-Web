
{% assign posts=site.posts}
{% for post in posts %}
<div id="{{ post.date | date: "%b %-d, %Y" }}" class="post">
## [{{ post.title }}]({{ post.url | prepend: site.baseurl }})
{{ post.content }}
</div>
{% endfor %}
