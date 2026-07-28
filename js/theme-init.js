/* Applies the saved (or OS-preferred) theme before first paint to avoid a flash
   of the wrong theme. Loaded synchronously in <head> — keep it tiny. */
(function(){
  try{
    var t = localStorage.getItem('theme');
    if(!t) t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  }catch(e){}
})();
