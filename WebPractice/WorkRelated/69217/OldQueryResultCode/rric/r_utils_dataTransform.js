/**
 * Created by aps015 on 7/4/2015.
 */

/*
Function ric_dataTransform
    It allows data transformation for display.
    It may contain JSON adaptation from incoming object into diplay-drivig object (e.g. convert address fields into
    array objects for display).
    It may also contain particular element conversions/modifications (e.g. add highlighting to duplicate SSN in same record).
*/


export default function(datas) {

    if(datas && (datas instanceof Array))
    {
        for (var di = 0; di < datas.length; di++) {
            var dt = datas[di];

            //*** translation elements ***:

            // In indentification, highight multiple SSNss
            if (dt.hasOwnProperty("key") && (dt.key == "Identification")) {
                if (dt.fd instanceof Array) {
                    for(var f=0;f<dt.fd.length;f++) {
                        if (dt.fd[f] instanceof Array) {
                            var arrSsn = dt.fd[f].reduce(function (p, c, i, a) {
                                if (c.key.toUpperCase() == "SSN") {
                                    p.push(i);
                                }
                                return p;
                            }, []);
                            if (arrSsn.length > 1) {
                                arrSsn.reduce(function (p, c, i, a) {
                                    dt.fd[f][c].bkg = "cyan";
                                },0);
                            }
                        }
                    }
                }
            }
        }
    }

    return datas;
};
