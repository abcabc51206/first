<%@page contentType="text/html;charset=UTF-8"%>
<%@ page import="org.springframework.security.core.AuthenticationException" %>
<%@ page import="org.springframework.security.web.authentication.AbstractProcessingFilter" %>
<html>
<head>
    <title>Login to CAS failed!</title>
</head>

<body>
<h2>Login to CAS failed!</h2>
<font color="red">
    Your CAS credentials were rejected.<br/><br/>
    Reason: <%=((AuthenticationException) session.getAttribute(AbstractProcessingFilter.SPRING_SECURITY_LAST_EXCEPTION_KEY)).getMessage()%>，请与系统管理员联系。
    <a href="<%=basePath%>j_spring_security_logout">返回门户首页</a>
</font>

</body>
</html>
