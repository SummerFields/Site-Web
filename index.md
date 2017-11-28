{%  for post in paginator.posts %}
  <h1><a href="">{{ post.title }}</a></h1>
  <p class="author">
    <span class="date">{{  post.date }}</span>
  </p>
  <div class="content">
    {{  post.content }}
  </div>
{%  endfor %}

<div class="pagination">
{% if paginator.previous_page %}
    <a href="/page" class="previous">Page précédente</a>
{%  else %}
    <span class="previous">Page précédente</span>
{%  endif %}
  <span class="page_number ">Page:  sur </span>
{%  if paginator.next_page %}
    <a href="/page" class="next">Page suivante</a>
{%  else %}
    <span class="next">Page suivante</span>
{%  endif %}
</div>
