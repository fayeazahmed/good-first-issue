from bs4 import BeautifulSoup
import json
import requests


def getResults(p, query):
    repos = []
    try:
        search_result = requests.get(
            f"https://github.com/search?p={p}&q={query}&type=Repositories").text
        soup = BeautifulSoup(search_result, 'lxml')
        repos.extend(soup.find_all('li', class_='repo-list-item'))
    except:
        None
    # for i in range(10):
    #     try:
    #         search_result = requests.get(
    #             f"https://github.com/search?p={i+1}&q={query}&type=Repositories").text
    #         soup = BeautifulSoup(search_result, 'lxml')
    #         repos.extend(soup.find_all('li', class_='repo-list-item'))
    #     except:
    #         break
    repo_list = []
    for repo in repos:
        try:
            repo_name = repo.find(
                'div', class_='f4 text-normal').text.replace("\n", '').strip()
            repo_issues = requests.get(
                f"https://github.com/{repo_name}/labels/Good%20first%20issue").text
            repo_issues = BeautifulSoup(repo_issues, 'lxml')
            good_first_issues = repo_issues.find_all("div", class_='Box-row')

            if good_first_issues:
                repo_desc = repo.find(
                    'p', class_='mb-1').text.replace("\n", '').strip()
                repo_stars = repo.find(
                    'a', class_='Link--muted').text.replace("\n", '').strip()
                issues = []
                for issue in good_first_issues:
                    issue_link = issue.find('a', class_='Link--primary')
                    issue_desc = issue_link.text
                    issue_open = issue.find(
                        'span', class_='opened-by').text.replace("\n", '').strip()
                    issue_link = issue_link['href']
                    issues.append(
                        {"description": issue_desc, "link": issue_link, "issueOpen": issue_open})
                json_res = {
                    "name": repo_name,
                    "description": repo_desc,
                    "stars": repo_stars,
                    "goodFirstIssues": issues
                }
                repo_list.append(json_res)
        except:
            continue

    return json.dumps(repo_list)
