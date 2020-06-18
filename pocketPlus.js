async function getPocketData() {
  const pocketData = await fetch("https://getpocket.com/v3/get?enable_cors=1&consumer_key=78809-9423d8c743a58f62b23ee85c", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-AR,en-US;q=0.9,en;q=0.8,es-AR;q=0.7,es;q=0.6",
      "cache-control": "max-age=0",
      "content-type": "application/json",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-accept": "application/json; charset=UTF8"
    },
    "referrer": "https://app.getpocket.com/",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": "{\"images\":1,\"videos\":1,\"tags\":1,\"rediscovery\":1,\"annotations\":1,\"authors\":1,\"itemTopics\":1,\"meta\":1,\"posts\":1,\"total\":1,\"state\":\"unread\",\"offset\":0,\"sort\":\"newest\",\"count\":0,\"detailType\":\"complete\",\"forceaccount\":1,\"locale_lang\":\"en-US\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  })
    .then(response => {return response.json()})
    .then(result => {return result;})
    .catch(error => error);

    console.log('PocketPlus: Data received. Processing data now :)');
  return pocketData;
}

async function Start() {
  const pocketData = await getPocketData();
  const list = Object.entries(pocketData.list).map(( [key, value] ) => (value));

  const listHostnameCount = {};

  list.forEach(element => {
    let name = new URL(element.resolved_url).hostname.replace('www.','');
    if (name in listHostnameCount) {
      listHostnameCount[name] = listHostnameCount[name] + 1;
    } else {
      listHostnameCount[name] = 1;
    }
  });

  const listHostnameCountSorted = Object.entries(listHostnameCount).map(( [key, value] ) => ({ source: key, count: value })).sort((a,b) => {return a.count - b.count});

  const dropdown = document.getElementById('PocketPlusSourcesFilter');

  listHostnameCountSorted.forEach(hostname => {
    let option = document.createElement("option");
    option.text = hostname.source + ' (' + hostname.count + ')';
    option.value = hostname.source;
    dropdown.add(option);
  })
  dropdown.options[0].text = 'All Sources';
  dropdown.options[0].disabled = false;
  console.log('PocketPlus: Done :)');
}

console.log('PocketPlus: Requesting data to Pocket :)');

document.getElementById('root').addEventListener('DOMNodeInserted', function(event){
  if (!document.getElementById('PocketPlusSourcesFilter')) {
    const dropdown = document.createElement('select');
    dropdown.setAttribute("id", "PocketPlusSourcesFilter");
    dropdown.style.width = '100%';
    dropdown.style.height = '30px';
    const optionStart = document.createElement("option");
    optionStart.text = 'Loading sources...';
    optionStart.disabled = true;
    optionStart.selected = true;
    optionStart.value = 'all';
    dropdown.add(optionStart);
    dropdown.addEventListener('change', function(event){
      if (event.target.value === 'all') {
        document.querySelector('[href="/"]').click();
      } else {
        if (document.querySelector('[aria-label="Search"]')) document.querySelector('[aria-label="Search"]').click()
        document.querySelector('[placeholder=" Search"]').value = event.target.value;
        document.querySelector('[placeholder=" Search"]').dispatchEvent(new Event('input', { bubbles: true }));
        document.querySelector('button[type="cta"]').click()
      }
    })
    document.querySelector('[aria-label="Videos Filter"]').parentElement.appendChild(dropdown)
  }
})

Start();