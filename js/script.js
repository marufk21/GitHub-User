document.addEventListener("DOMContentLoaded", function () {
  fetchData(1); // Load the initial page
});

let currentPage = 1;

function fetchData(page) {
  const perPage = document.getElementById("perPage").value;
  const search = document.getElementById("search").value;
  const loader = document.getElementById("loader");
  const userInfoDiv = document.getElementById("userInfo");
  const repositoriesDiv = document.getElementById("repositories");
  const currentPageSpan = document.getElementById("currentPage");

  // Show loader while fetching data
  loader.style.display = "block";
  userInfoDiv.innerHTML = "";
  repositoriesDiv.innerHTML = "";

  // Update current page
  currentPage = page;

  // Fetch user details
  fetch("https://api.github.com/users/johnpapa")
    .then((response) => response.json())
    .then((user) => {
      // Display user information
      userInfoDiv.innerHTML = `
      <div class="user-info" id="userInfo">
      <!-- User information will be displayed here -->
      <img src="${
        user.avatar_url
      }" alt="User Avatar" style="width: 100px; height: 100px; border-radius: 50%; margin-right: 10px;">
      <div style="display: inline-block;">
        <h2 style="color: #333; margin-bottom: 5px;">${
          user.name || user.login
        }</h2>
        <p style="color: #555; margin-bottom: 5px;">${
          user.bio || "No bio available"
        }</p>
        <p style="color: #555; margin-bottom: 0;">Location: ${
          user.location || "Not specified"
        }</p>
      </div>
    </div>
            `;

      // Fetch user repositories for the specified page
      fetch(
        `https://api.github.com/users/johnpapa/repos?per_page=${perPage}&page=${currentPage}&q=${search}`
      )
        .then((response) => response.json())
        .then((repositories) => {
          // Hide loader after data is fetched
          loader.style.display = "none";

          // Display repositories
          repositories.forEach((repository) => {
            repositoriesDiv.innerHTML += `
                            <div class="repository">
                                <h2>${repository.name}</h2>
                                <p>${
                                  repository.description ||
                                  "No description available"
                                }</p>
                                <button>${
                                  repository.language || "Not specified"
                                }</button>
                            </div>
                        `;
          });

          // Update current page span
          currentPageSpan.textContent = currentPage;
        })
        .catch((error) => {
          // Hide loader on error
          loader.style.display = "none";
          console.error("Error fetching repositories:", error);
        });
    })
    .catch((error) => {
      // Hide loader on error
      loader.style.display = "none";
      console.error("Error fetching user details:", error);
    });
}

function changePage(direction) {
  const newPage = currentPage + direction;

  // Ensure new page is within bounds (greater than 0)
  if (newPage > 0) {
    fetchData(newPage);
  }
}
