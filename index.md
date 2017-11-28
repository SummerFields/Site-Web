{% for post in site.posts %}
  <article id="" class="post">
# {{ post.title }}
{{ post.content }}
  </article>
{% endfor %}
