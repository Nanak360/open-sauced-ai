import "../../content-scripts.css";
import { createHtmlElement } from "../../../utils/createHtmlElement";
import { getAuthToken } from "../../../utils/checkAuthentication";
import { voteOrUnvoteRepo } from "../../../utils/fetchOpenSaucedApiData";
import { InsightsSelectDropdown } from "../InsightsSelectDropdown/InsightsSelectDropdown";

export const RepoUnvoteButton = (ownerName: string, repoName: string) => {
  const repoUnvoteButton = createHtmlElement("li", {
    id: "repo-voting-button",
    className:
      "text-white text-center hover:shadow-button bg-gradient-to-r from-[#e67e22] to-[#d35400] btn btn-sm",
    innerHTML: `
            <span>Unvote</span>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" class="align-middle"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"></path></g></svg>
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-triangle-down text-gray-200 align-middle" id="insights-dropdown-btn">
            <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"></path>
            </svg>
        `,
  });

  repoUnvoteButton.addEventListener("click", async () => {
    repoUnvoteButton.innerHTML = `
      <span>Loading...</span>
    `;
    const userToken = await getAuthToken();

    const unvoted = await voteOrUnvoteRepo(userToken, ownerName, repoName, "DELETE");

    if (unvoted) {
      const { VoteRepoButton } = await import("./RepoVoteButton");
      repoUnvoteButton.replaceWith(VoteRepoButton(ownerName, repoName));
    } else {
      console.log("Something went wrong");
      repoUnvoteButton.innerHTML = `
        <span>Unvote</span>
        `;
    }
  });

  const insightsDropdownBtn = repoUnvoteButton.querySelector(
    "#insights-dropdown-btn",
  )!;

  insightsDropdownBtn.addEventListener("click", async e => {
    e.stopPropagation();
    const insightsDropdown = await InsightsSelectDropdown(ownerName, repoName) as HTMLDivElement;

    repoUnvoteButton.appendChild(insightsDropdown);
    insightsDropdown.classList.toggle("hidden");
  });

  return repoUnvoteButton;
};
