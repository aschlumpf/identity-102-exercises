const content = document.getElementById("content");
const navbar = document.getElementById("navbar-container");
const loadingIndicator = document.getElementById("loading-indicator");
let auth0Client;

window.onload = async function () {
  let requestedView = window.location.hash;

  auth0Client = await createAuth0Client({
    domain: "dev-0z-g3w72.us.auth0.com",
    client_id: "yCxr77xFp8wNqdnUD9l6Nz7dQ5dn28WI",
  });

  if (requestedView === "#callback") {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
  }

  await loadView("#navbar", navbar);

  window.location.hash = requestedView;
};

window.onhashchange = async function () {
  let requestedView = window.location.hash;

  if (requestedView !== "#home" && requestedView !== "#expenses") {
    requestedView = "#home";
  }

  await loadView(requestedView, content);
};

async function loadView(viewName, container) {
  container.innerHTML = "";
  viewName = viewName.substring(1);
  window.history.replaceState({}, document.title, `/#${viewName}`);
  const response = await fetch(`/views/${viewName}.html`);
  container.innerHTML = await response.text();

  var scriptTag = document.createElement("script");
  scriptTag.src = `/scripts/${viewName}.js`;

  container.appendChild(scriptTag);

  loadingIndicator.style.display = "none";
  container.style.display = "block";
}

// async function allowAccess() {
//   await loadView("#home", content);
//   return false;
// }
async function allowAccess() {
  if (await auth0Client.isAuthenticated()) {
    return true;
  }
  await loadView("#home", content);
  return false;
}
