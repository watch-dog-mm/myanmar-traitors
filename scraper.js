(function scrapeFBPosts() {
  function scrollToBottom(flag, resolve) {
    if (flag) {
      window.scrollTo(0, document.body.scrollHeight);

      setTimeout(
        () =>
          scrollToBottom(document.querySelector("#see_more_cards_id"), resolve),
        3000
      );
    } else {
      resolve();
    }
  }
  function scrapeAllPosts() {
    var posts = [];
    document
      .querySelectorAll(`[style='padding-top:8px']`)
      .forEach((item, id) => {
        var moreButton = item
          .querySelector(`[data-ft='{"tn":"*s"}']`)
          ?.querySelector(`[data-sigil='more']`);
        if (moreButton) {
          moreButton.click();
        }
        var desc = item.querySelector(`[data-ft='{"tn":"*s"}']`)?.innerText;

        var url = item.querySelector(`[data-ft='{"tn":"*s"}']>a`)?.href;
        var images = [];
        item.querySelectorAll(`.img`).forEach((image) => {
          !!image &&
            images.push(
              image?.style.backgroundImage
                .replace(`url("`, "")
                .replace(`")`, "")
            );
        });

        images = images.filter((i) => i !== "");
        if (desc) {
          var post = { id, desc, url, images };
          posts.push(post);
        }
      });
    return posts;
  }
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/javascript;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
  async function scrapeNclean() {
    var list = await new Promise((resolve, reject) =>
      scrollToBottom(document.querySelector("#see_more_cards_id"), resolve)
    ).then((resolve) => scrapeAllPosts());
    download('traitors.json',JSON.stringify(list))
    return list;
  }
  scrapeNclean()
})();
