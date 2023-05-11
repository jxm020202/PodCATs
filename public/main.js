document.addEventListener('DOMContentLoaded', function () {
    const upvoteButtons = document.querySelectorAll('.upvote-button');
  
    upvoteButtons.forEach((button) => {
      button.addEventListener('click', async function () {
        const postId = button.dataset.postId;
        const isLoggedIn = !!document.querySelector('a[href="/logout"]');
  
        if (!isLoggedIn) {
          window.location.href = '/login';
          return;
        }
  
        const response = await fetch(`/posts/${postId}/upvote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
  
        if (response.ok) {
          const updatedPost = await response.json();
          button.querySelector('.upvote-arrow').classList.toggle('upvoted');
          button.nextElementSibling.textContent = `${updatedPost.points} points`;
        }
      });
    });
  });
  