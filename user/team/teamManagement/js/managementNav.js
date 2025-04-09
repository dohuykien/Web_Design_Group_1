/*
* Fetches, inserts, and configures the team management navigation bar.
 * This function should be called after the DOM is fully loaded.
 * @param {string} containerId The ID of the HTML element to load the nav into.
 * @param {string} navHtmlPath The path to the managementnav.html file. Defaults to 'managementnav.html'.
 */
async function loadAndSetupManagementNav(containerId, navHtmlPath = 'managementNav.html') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Management nav container with ID "${containerId}" not found.`);
        return;
    }

    try {
        // 1. Fetch the navigation HTML
        const response = await fetch(navHtmlPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} while fetching ${navHtmlPath}`);
        }
        const navHtml = await response.text();

        // 2. Insert the HTML into the container
        container.innerHTML = navHtml;
        console.log(`Management nav loaded into #${containerId}`);

        // 3. Get Team ID from current URL
        const urlParams = new URLSearchParams(window.location.search);
        const currentTeamId = urlParams.get('id');

        // 4. Get Current Page Filename for Active State
        const currentPagePath = window.location.pathname;
        const currentPageFilename = currentPagePath.substring(currentPagePath.lastIndexOf('/') + 1) || 'index.html'; // Default to index.html if path ends in /
        console.log(`Current Page Filename: ${currentPageFilename}, Team ID: ${currentTeamId}`);


        // 5. Select links within the *loaded* nav and configure them
        const navLinks = container.querySelectorAll('.team-management-nav a.nav-button');

        navLinks.forEach(link => {
            const originalHref = link.getAttribute('href');
            let linkFilename = '';
            let linkUrl = null; // To store the parsed URL object

            if (originalHref && originalHref !== '#' && !originalHref.startsWith('javascript:')) {
                try {
                    // *** THIS IS THE KEY CHANGE ***
                    // Use the FULL current page URL as the base for resolving relative links
                    linkUrl = new URL(originalHref, window.location.href);
                    // Example:
                    // If current page is http://yourserver.com/dashboard/members.html?id=123
                    // and originalHref is "editteam.html"
                    // new URL("editteam.html", "http://yourserver.com/dashboard/members.html?id=123")
                    // will correctly resolve linkUrl.href to "http://yourserver.com/dashboard/editteam.html"

                    linkFilename = linkUrl.pathname.substring(linkUrl.pathname.lastIndexOf('/') + 1) || 'index.html';

                    // Update href with Team ID (if present)
                    if (currentTeamId) {
                        linkUrl.searchParams.set('id', currentTeamId);
                    }
                    // Always set the link's href from the potentially modified linkUrl object
                    link.href = linkUrl.toString();
                    console.log(`Updated link for ${linkFilename} to: ${link.href}`);


                } catch (e) {
                    console.error(`Failed to parse or update URL for link: ${originalHref}`, e);
                    // Fallback (less likely to work correctly if base path is the issue)
                    if(currentTeamId) {
                        if (originalHref.includes('?')) {
                            link.href = `${originalHref}&id=${encodeURIComponent(currentTeamId)}`;
                        } else {
                            link.href = `${originalHref}?id=${encodeURIComponent(currentTeamId)}`;
                        }
                    } else {
                       link.href = originalHref;
                    }
                    const pathOnly = link.href.split('?')[0].split('#')[0];
                    linkFilename = pathOnly.substring(pathOnly.lastIndexOf('/') + 1) || 'index.html';
                }
            }

            // Set Active State (logic remains the same)
            if (linkFilename && linkFilename === currentPageFilename) {
                console.log(`Setting active state for: ${linkFilename}`);
                link.classList.add('active');
            } else if (!currentTeamId && linkFilename && linkFilename !== currentPageFilename) {
                console.log(`No Team ID found, potentially disabling link: ${link.href}`);
                // Optional disabling logic
            }
        });

    } catch (error) {
        console.error("Error loading or setting up management nav:", error);
        if (container) {
            container.innerHTML = "<p class='error-message' style='color: red; padding: 10px;'>Lỗi tải menu quản lý đội.</p>"; // User-friendly error
        }
    }
}