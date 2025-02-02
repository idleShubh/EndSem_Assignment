let isDarkTheme = false;

        function toggleTheme() {
            isDarkTheme = !isDarkTheme;
            document.body.classList.toggle('dark-theme');
        }

        async function fetchProfile() {
            const username = document.getElementById('username').value;
            const card = document.getElementById('profile-card');
            
            try {
                const response = await fetch(`https://api.github.com/users/${username}`);
                const userData = await response.json();

                if (response.status === 404) {
                    throw new Error('User not found');
                }

                const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
                const reposData = await reposResponse.json();
                
                const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);

                card.style.display = 'block';
                card.innerHTML = `
                    <img src="${userData.avatar_url}" alt="Profile" class="profile-image">
                    <h2>${userData.name || username}</h2>
                    ${userData.bio ? `<p class="bio">${userData.bio}</p>` : ''}
                    <div class="stats">
                        <div class="stat-box">
                            <h3>${userData.public_repos}</h3>
                            <p>Repositories</p>
                        </div>
                        <div class="stat-box">
                            <h3>${userData.followers}</h3>
                            <p>Followers</p>
                        </div>
                        <div class="stat-box">
                            <h3>${userData.following}</h3>
                            <p>Following</p>
                        </div>
                    </div>
                    <div class="links">
                        <a href="${userData.html_url}" target="_blank">GitHub Profile</a>
                        ${userData.blog ? `<a href="${userData.blog}" target="_blank">Website</a>` : ''}
                    </div>
                    <p style="margin-top: 1rem">
                        ${userData.location ? `📍 ${userData.location}` : ''}
                        ${userData.company ? ` • 🏢 ${userData.company}` : ''}
                    </p>
                    <button onclick="downloadCard()" class="download-btn">⬇️ Download Card</button>
                `;
            } catch (error) {
                card.style.display = 'block';
                card.innerHTML = `<p>Error: ${error.message}</p>`;
            }
        }

        async function downloadCard() {
            const card = document.getElementById('profile-card');
            try {
                const canvas = await html2canvas(card, {
                    backgroundColor: getComputedStyle(card).backgroundColor
                });
                
                const link = document.createElement('a');
                link.download = 'github-profile-card.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (error) {
                console.error('Error downloading card:', error);
            }
        }