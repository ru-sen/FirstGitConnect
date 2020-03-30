/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 * Version            Date          Author           Remarks 
 * 1.0              2019/03/26      tonyzou          create
 * 1.1              2019/03/27      tonyzou          样式调整+字段取值
 * vendorbill打印pdf
 */
define(['N/render','N/file', 'N/format', 'N/record', 'N/runtime', 'N/search'],
/**
 * @param {render} render
 * @param {file} file
 * @param {format} format
 * @param {record} record
 * @param {runtime} runtime
 * @param {search} search
 */
function(render,file, format, record, runtime, search) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
        var request = context.request;
        var response = context.response;

        var recordId = request.parameters.recordId;
        var vendbillRecord = record.load({type:record.Type.VENDOR_BILL,id:recordId,isDynamic: true});
        //department
        var hz_department = vendbillRecord.getText({fieldId:'department'})||"";
        //trandate
        var hz_trandate = vendbillRecord.getValue({fieldId:'trandate'});
        //total
        var hz_total = vendbillRecord.getValue({fieldId:'total'})||0.0;
      
        /*
        var _columns=[];
        _columns.push(search.createColumn({name:'item',join:'item'}));
        var vendbillSearch = search.lookupFields({type:record.Type.VENDOR_BILL,columns:_columns,id:recordId});
        log.debug('vendbillSearch',vendbillSearch);
        */
        
        //获取明细行总行数
        var numLines = vendbillRecord.getLineCount({
            sublistId: 'item'
        });
       log.debug('numLines',numLines);
        
     //发票打印
     var xmlStr="<?xml version=\"1.0\"?>\n" +
        "<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n" +
        "<pdf lang=\"zh_CN\">\n"+
		"<head>\n"+
		"<macrolist>\n <macro id=\"nlfooter\">\n <table  style=\"width: 100%;\">\n<tr>\n <td align=\"right\">\n<pagenumber/>\n</td>\n </tr>\n</table>\n</macro>\n</macrolist>\n"+
		"</head>\n"+
		"<body size=\"A4\" footer=\"nlfooter\">"+
		""+
		"<table width=\"100%\">\n"+
		"<tr align=\"center\">"+
		"<td>"+
		"<p align=\"center\" font-size=\"20px\" font-weight=\"bold\" color=\"red\">"+
		"费用报销单"+
		"</p>"+
		"</td>"+
		"</tr>"+
		"<tr><td></td></tr><tr><td></td></tr><tr><td></td></tr>"+
		"</table>"+
		"<table width=\"100%\">\n"+
		"<tr>"+
		"<td colspan=\"2\" color=\"red\" align=\"left\">"+
		"供应商"+
		"</td>"+
		"</tr>"+
		"<tr>"+
		"<td color=\"red\" align=\"left\">"+
		"部门:&nbsp;&nbsp;<span font-weight=\"bold\" color=\"black\">"+hz_department+
		"</span>"+
		"</td>"+
		"<td color=\"red\" align=\"right\">"+
		"日期:&nbsp;&nbsp;<span font-weight=\"bold\" color=\"black\">"+formateDate(hz_trandate)+
		"</span>"+
		"</td>"+
		"</tr>"+
		"</table>"+
		"<table width=\"100%\">\n"+
		"<tr>\n"+
		"<td text-align=\"justify\" align=\"center\" border-right=\"1px solid red\" border-left=\"1px solid red\" border-top=\"1px solid red\" border-bottom=\"1px solid red\">\n"+
		"摘要"+
		"</td>\n"+
		"<td text-align=\"justify\" align=\"center\"  border-right=\"1px solid red\" border-top=\"1px solid red\" border-bottom=\"1px solid red\">\n"+
		"金额"+
		"</td>\n"+
		"<td text-align=\"justify\" align=\"center\" border-right=\"1px solid red\" border-top=\"1px solid red\" border-bottom=\"1px solid red\">\n"+
		"单据张数"+
		"</td>\n"+
		"</tr>\n"+
		"<tr>\n"+
		"<td  align=\"center\" border-right=\"1px solid red\" border-left=\"1px solid red\" border-bottom=\"1px solid red\">\n"+
		"原材料"+
		"</td>\n"+
		"<td align=\"center\" border-right=\"1px solid red\"  border-bottom=\"1px solid red\">\n"+
		formatMoney(hz_total)+
		"</td>\n"+
		"<td align=\"center\" border-right=\"1px solid red\" border-bottom=\"1px solid red\">\n"+
		""+
		"</td>\n"+
		"</tr>\n"+
		"<tr>"+
		"<td align=\"left\" border-right=\"1px solid red\" border-left=\"1px solid red\" border-bottom=\"1px solid red\" colspan=\"3\">"+
		"合计人民币(大写):&nbsp;"+DX(hz_total)+
		"</td>"+
		"</tr>"+
		"</table>\n"+
		"<table width=\"100%\">\n"+
		"<tr><td>&nbsp;</td></tr><tr><td></td></tr><tr><td></td></tr>"+
		"<tr>"+
		"<td>"+
		"<p align=\"left\" font-weight=\"bold\" color=\"red\">"+
		"制单人："+
		"</p>"+
		"</td>"+
		"<td>"+
		"<p align=\"left\" font-weight=\"bold\" color=\"red\">"+
		"审核："+
		"</p>"+
		"</td>"+
		"<td>"+
		"<p align=\"left\" font-weight=\"bold\" color=\"red\">"+
		"财务复核："+
		"</p>"+
		"</td>"+
		"<td>"+
		"<p align=\"left\" font-weight=\"bold\" color=\"red\">"+
		"总经理审批:"+
		"</p>"+
		"</td>"+
		"</tr>"+
		"</table>\n"+
		"<br/>"+
		"<table width=\"100%\">\n"+
        "<thead>\n"+ 
        "<tr width=\"100%\" border=\"1px solid black\">\n"+
        "<td border=\"1px solid black\" border-right=\"none\" border-top=\"none\" border-bottom=\"none\"><p font-size = \"10px\" align=\"center\" font-weight=\"bold\">"+"货品编码"+"</p></td>\n"+
        "<td style=\"width: 50px;\" border=\"1px solid black\" border-right=\"none\" border-top=\"none\" border-bottom=\"none\"><p font-size = \"10px\" align=\"center\" font-weight=\"bold\">"+"货品描述和规格"+"</p></td>\n"+
        "<td border=\"1px solid black\" border-right=\"none\" border-top=\"none\" border-bottom=\"none\"><p font-size = \"10px\" align=\"center\" font-weight=\"bold\">"+"收货数量"+"</p></td>\n"+
        "<td border=\"1px solid black\" border-right=\"none\" border-top=\"none\" border-bottom=\"none\"><p font-size = \"10px\" align=\"center\" font-weight=\"bold\">"+"单位"+"</p></td>\n"+
        "<td border=\"1px solid black\" border-right=\"none\" border-top=\"none\" border-bottom=\"none\"><p font-size = \"10px\" align=\"center\" font-weight=\"bold\">"+"单价"+"</p></td>\n"+
        "<td border=\"1px solid black\" border-right=\"none\" border-top=\"none\" border-bottom=\"none\"><p font-size = \"10px\" align=\"center\" font-weight=\"bold\">"+"金额"+"</p></td>\n"+
        "<td border=\"1px solid black\" border-right=\"none\" border-top=\"none\" border-bottom=\"none\"><p font-size = \"10px\" align=\"center\" font-weight=\"bold\">"+"订单号"+"</p></td>\n"+
        "<td border=\"1px solid black\" border-right=\"none\" border-top=\"none\" border-bottom=\"none\"><p font-size = \"10px\" align=\"center\" font-weight=\"bold\">"+"含税单价"+"</p></td>\n"+
        "<td border=\"1px solid black\" border-top=\"none\" border-bottom=\"none\"><p font-size = \"10px\" align=\"center\" font-weight=\"bold\">"+"仓库"+"</p></td>\n"+
        "</tr>\n"+
        "</thead>\n"+
        "<tbody >\n";
     var itemnoArr=[];
     if(numLines>0){
    	 for(var i=0;i<numLines;i++){
    		 var itemno = vendbillRecord.getSublistValue({
 			    sublistId: 'item',
 			    fieldId: 'item',
 			    line: i
 			});
    		 itemnoArr.push(itemno);
    	 }
     }
     
     var getItemDescriptionArr=GetItemDescription(itemnoArr);
     log.debug('getItemDescriptionArr',getItemDescriptionArr);
     var guigeArr=[];
     if(getItemDescriptionArr.getAllData.length>0){
    	 for(var j=0;j<getItemDescriptionArr.getAllData.length;j++){
    		 guigeArr.push(getItemDescriptionArr.getAllData[j].getValue('displayname'))
    	 }
     }
     if(numLines>0){
    	 for(var i=0;i<numLines;i++){
    		 /**
    	         * 货品编码-->item
    	         * 货品描述和规格-->description+displayname
    	         * 收货数量-->quantity
    	         * 单位-->unitsdisplay
    	         * 单价-->rate
    	         * 金额-->amount
    	         * 订单号-->tranid
    	         * 含税单价-->grossamt/quantity
    	         * 仓库-->location
    	         */
    		//货品internalid
    		 var itemno = vendbillRecord.getSublistValue({
    			    sublistId: 'item',
    			    fieldId: 'item',
    			    line: i
    			});
    		 //货品编码
    		 var itemname = vendbillRecord.getSublistText({
 			    sublistId: 'item',
 			    fieldId: 'item',
 			    line: i
 			})||"";
    		 //货品描述
    		 var itemdesc = vendbillRecord.getSublistValue({
 			    sublistId: 'item',
			    fieldId: 'description',
			    line: i
			})||"";
    		 //货品规格
    		 var itemnumber =guigeArr[i]||''; //GetItemDescription(itemno).displayname;//获取item里的itemnumber 规格  
    		 var itemdescandguige=itemnumber+'<br/>'+itemdesc;
    		 //收获数量
    		 var itemquantity = vendbillRecord.getSublistValue({
  			    sublistId: 'item',
 			    fieldId: 'quantity',
 			    line: i
 			})||0;
    		 //单位
    		 var itemunit = vendbillRecord.getSublistText({
    			 sublistId: 'item',
    			 fieldId: 'units',
    			 line: i
    		 })||"";
    		 //单价
    		 var itemrate = vendbillRecord.getSublistValue({
    			 sublistId: 'item',
    			 fieldId: 'rate',
    			 line: i
    		 })||0.0;
    		 var itemamount = vendbillRecord.getSublistValue({
    			 sublistId: 'item',
    			 fieldId: 'amount',
    			 line: i
    		 })||0.0;
    		//tranid 订单号
 	        var hz_tranid = vendbillRecord.getValue({fieldId:'custcol9'})||"";
 	        
    		 var itemgrossamt = vendbillRecord.getSublistValue({
    			 sublistId: 'item',
    			 fieldId: 'grossamt',
    			 line: i
    		 })||0.0;
    		 var itemlocation = vendbillRecord.getSublistText({
    			 sublistId: 'item',
    			 fieldId: 'location',
    			 line: i
    		 })||"";
    		 xmlStr+="<tr width=\"100%\">\n"+
    	    	"<td  border-left=\"0.5px solid black\" border-bottom=\"0.5px solid black\" align=\"left\"><p font-size = \"10px\" >"+itemname+"</p></td>\n"+
    	    	"<td  style=\"width: 50px;\"  border-left=\"0.5px solid black\" border-bottom=\"0.5px solid black\" align=\"left\"><p font-size = \"6px\">"+itemnumber+"<br/>"+itemdesc+"</p></td>\n"+
    	    	"<td  border-left=\"0.5px solid black\" border-bottom=\"0.5px solid black\" align=\"center\"><p font-size = \"10px\">"+itemquantity+"</p></td>\n"+
    	    	"<td  border-left=\"0.5px solid black\" border-bottom=\"0.5px solid black\" align=\"center\"><p font-size = \"10px\">"+itemunit+"</p></td>\n"+
    	    	"<td  border-left=\"0.5px solid black\" border-bottom=\"0.5px solid black\" align=\"center\"><p font-size = \"10px\">"+parseFloat(itemrate).toFixed(2)+"</p></td>\n"+
    	    	"<td  border-left=\"0.5px solid black\" border-bottom=\"0.5px solid black\" align=\"center\"><p font-size = \"10px\">"+itemamount+"</p></td>\n"+
    	    	"<td  border-left=\"0.5px solid black\" border-bottom=\"0.5px solid black\" align=\"center\"><p font-size = \"10px\">"+hz_tranid+"</p></td>\n"+
    	    	"<td  border-left=\"0.5px solid black\" border-bottom=\"0.5px solid black\" align=\"center\"><p font-size = \"10px\">"+(parseFloat(itemgrossamt)/parseFloat(itemquantity)).toFixed(2)+"</p></td>\n"+
    	    	"<td  border-left=\"0.5px solid black\" border-right=\"0.5px solid black\" border-bottom=\"0.5px solid black\" align=\"center\"><p font-size = \"10px\">"+itemlocation+"</p></td>\n"+
    	    	"</tr>\n";
    	 }
     }	
     xmlStr+="</tbody >\n"+
        "</table>\n"+
		"</body>\n"+
		"</pdf>";
		var files = render.xmlToPdf({
		  xmlString: xmlStr,
		  
		});
		files.name='vendbill'+recordId+'.pdf';
        //var file_id = xml_file.save();
        response.writeFile(files, false);
    }

    //数字用逗号隔开
    function formatMoney(s, type) {  
        if (/[^0-9\.]/.test(s))  
            return "0";  
        if (s == null || s == "")  
            return "0";  
        s = s.toString().replace(/^(\d*)$/, "$1.");  
        s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");  
        s = s.replace(".", ",");  
        var re = /(\d)(\d{3},)/;  
        while (re.test(s))  
            s = s.replace(re, "$1,$2");  
        s = s.replace(/,(\d\d)$/, ".$1");  
        if (type == 0) {// 不带小数位(默认是有小数位)  
            var a = s.split(".");  
            if (a[1] == "00") {  
                s = a[0];  
            }  
        }  
        return s;  
    }  
    
    //数字转大写
    function DX(n) {
    	 
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
            return "数据非法";
        var unit = "千百拾亿千百拾万千百拾元角分", str = "";
            n += "00";
        var p = n.indexOf('.');
        if (p >= 0)
            n = n.substring(0, p) + n.substr(p+1, 2);
            unit = unit.substr(unit.length - n.length);
        for (var i=0; i < n.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
}
    //格式化日期
    function formateDate(dateStr){
    	var mydate = new Date(dateStr);
    	var fullYear = mydate.getFullYear();//年
    	var month = mydate.getMonth()+1<10?'0'+(mydate.getMonth()+1):mydate.getMonth()+1;//月
    	var day = mydate.getDate()<10?'0'+mydate.getDate():mydate.getDate();
    	
    	return fullYear+'年'+month+'月'+day+'日';
    	
    }
  //获取item的规格 保质期  ITEM NAME/NUMBER
    function GetItemDescription(item_id) {
    	if(item_id.length==0){
    		return [];
    	}
    	var _filters=[];
    	_filters.push(['internalid','anyof',item_id]);
		var itemsearch = search.create({
			type:'item',
			filters:_filters,
			columns: ['displayname','itemid']
		});
		var allPage=1;
		var DataResult = itemsearch.runPaged({pageSize:1000});
		var totalCount = DataResult.count;
		if(totalCount>1000){
			allPage = Math.ceil(totalCount/1000);
		}
		//总数据
		var getAllData=[];
		for(var i=0;i<allPage && totalCount>0;i++){
			//取值
			var currentpage = DataResult.fetch({index:i});
			//是否是最后一页
			var isLast = currentpage.isLast;
			//数据
			var data = currentpage.data;
			getAllData=getAllData.concat(data);
			if(isLast){
				break;
			}
			
		}
		var ret = {};
		ret.getAllData = getAllData;
		return ret;
	}
    
    
    return {
        onRequest: onRequest
    };
    
});
