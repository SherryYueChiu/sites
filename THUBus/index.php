<!DOCTYPE html>
<html>
   <head>
      <title>公車問號??</title>
      <meta name="Description" content="東海大學公車追蹤資訊系統">
      <meta name="KeyWords" content="玥餅'東海大學'校內公車'公車'路線'時間表">
      <meta name="KeyWords" content="Sherry'Yue'THU'TungHai'Bus'Route'time'table">
      <meta name="Author" content="玥餅">
      <link rev="made" href="mailto:S06351019@thu.edu.tw">
      <meta name="Expired" content="31-jul-2020 00:00:00">
      <meta HTTP-EQUIV="Pragma" content="no_cache">
      <meta name="Creation-Date" content="09-mar-2020 08:00:00">
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <script src="./js/jquery.min.js"></script>
      <script src="./js/popper.min.js"></script>
      <script src="./js/bootstrap.min.js"></script>
      <link rel="stylesheet" href="./css/bootstrap.min.css">
      <link rel="stylesheet" type="text/css" href="./css/index.css">
   </head>
   <body>
      <div id="busRoute" style="display: none"></div>
      <div id="app">
         <div id="page1" class="w-100 h-100 page" align="center">
            <div class="tag bg-white p-4 mt-5 rounded-lg mx-auto shadow-lg w-75">
               <h3 class="color1">你來啦？</h3>
               <h5>公車不曉得來了沒...</h5>
               <select class="form-control-lg w-100 h-75 mt-3" id="chooseRoute" name="chooseDay">
                  <option value="2" align="center">往一校(平日)</option>
                  <option value="1" align="center">往二校(平日)</option>
                  <option value="3" align="center">往一校(假日)</option>
                  <option value="4" align="center">往二校(假日)</option>
               </select>
            </div>
            <div class="tag bg-dark p-4 mt-3 mb-5 rounded-lg mx-auto shadow-lg w-75">
               <button id="page1Submit" class="btn btn-block bgColor4">OK</button>
            </div>
         </div>
         <!--第二頁 篩選結果-->
         <div id="page2" class="w-100 h-100 page" align="center">
            <div class="tag bg-dark fixed-top p-1 mt-3 rounded-lg mx-auto shadow-lg w-75">
               <h3 id="clock" class="mt-2"></h3>
            </div>
            <div id="busStat" class="mt-5" align="center">
               <div class="row">
                  <div class="col-md-12">
                     <div id="busTimeline" class="main-timeline">
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="scannerImg"></div>
         <div align="center" id="footer" class="m-3 mb-4">
            <span class="badge badge-pill badge-light p-2 pl-3 pr-3 color4">玥餅 / THU 108-2</span>
         </div>
      </div>
      <div class="modal" id="shops">
         <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-sm">
            <div class="modal-content">
               <div class="modal-header">
                  <h1 class="modal-title">選一個</h1>
                  <button type="button" class="close" data-dismiss="modal">×</button>
               </div>
               <div class="modal-body">
                  <ul class="list-group list-group-flush">
                  </ul>
               </div>
            </div>
         </div>
      </div>
      <script type="text/javascript" src="./js/index.js"></script>
	  <!-- Default Statcounter code for THUBus  -->
      <script type="text/javascript">
         var sc_project=12215786; 
         var sc_invisible=1; 
         var sc_security="92de97a3"; 
         var sc_https=1; 
      </script>
      <script type="text/javascript"
         src="https://www.statcounter.com/counter/counter.js"
         async></script>
      <noscript>
         <div class="statcounter"><a title="Web Analytics"
            href="https://statcounter.com/" target="_blank"><img
            class="statcounter"
            src="https://c.statcounter.com/12215786/0/92de97a3/1/"
            alt="Web Analytics"></a></div>
      </noscript>
      <!-- End of Statcounter Code -->
   </body>
</html>