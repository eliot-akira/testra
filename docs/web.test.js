"use strict";(()=>{var{testra:t}=window,{test:e,is:s,ok:r,run:a,throws:n}=t;console.log("testra",t);e("test 1",()=>{r(!0,"truthy"),n(()=>{throw new Error("ok")},"should throw"),s({a:1},{b:2},"deep equal")});e("test 2",async()=>{await new Promise(o=>setTimeout(o,1e3)),r(!0,"async")});a();})();
//# sourceMappingURL=web.test.js.map
