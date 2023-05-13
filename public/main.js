document.addEventListener("DOMContentLoaded", function () {
  const upvoteButtons = document.querySelectorAll(".upvote-button");

  upvoteButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const postId = button.dataset.postId;
      const isLoggedIn = !!document.querySelector('a[href="/logout"]');

      if (!isLoggedIn) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`/posts/${postId}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const updatedPost = await response.json();
        button.querySelector(".upvote-arrow").classList.toggle("upvoted");
        button.parentElement.querySelector('.upvote-count').textContent = `${updatedPost.points}`;

      }
    });
  });

  const commentLinks = document.querySelectorAll(".comments-link");

  commentLinks.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      const count = link.dataset.commentCount;
      link.textContent = count === "0" ? "Be the first one to comment" : "Add comment";
    });
  
    link.addEventListener("mouseleave", function () {
      const count = link.dataset.commentCount;
      link.textContent = `Comments (${count})`;
    });
  });
});
