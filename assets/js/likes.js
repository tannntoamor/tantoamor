(function(){
  function getLikes(){ try{return JSON.parse(localStorage.getItem('ta_likes')||'{}')}catch(e){return {}} }
  function saveLikes(l){ localStorage.setItem('ta_likes', JSON.stringify(l)); }
  document.addEventListener('DOMContentLoaded', function(){
    const likes = getLikes();
    document.querySelectorAll('.ta-like').forEach(btn=>{
      const id = btn.dataset.id;
      if(likes[id]) btn.classList.add('active');
      btn.addEventListener('click', ()=>{
        btn.classList.toggle('active');
        likes[id] = btn.classList.contains('active');
        saveLikes(likes);
      });
    });
  });
})();
