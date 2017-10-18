<%@page contentType="text/html;charset=UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  
  <body>
   <div style="text-align:center;"><img src="<%=basePath%>images/500.png" style="margin-top:10%;"/></div>
   <div style="text-align:center;"><a href="<%=basePath%>index.html">返回管理中心首页</a></div>
  </body>
</html>
