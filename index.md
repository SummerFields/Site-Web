{% for post in site.posts %}
<article id="" class="post">
<h2>{{ post.title }}</h2>
{{ post.content }}
</article>
{% endfor %}
