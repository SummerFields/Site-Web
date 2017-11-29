{% for post in site.posts %}
<article id="" class="post">
<h2>{{ post.title }}</h2>
<div class="post-content">
{{ post.content }}
</div>
</article>
{% endfor %}
