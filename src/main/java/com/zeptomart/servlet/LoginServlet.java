package com.zeptomart.servlet;

import com.zeptomart.dao.UserDAO;
import com.zeptomart.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/login")   // <--- important
public class LoginServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        userDAO = new UserDAO();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");
        res.setContentType("text/html;charset=UTF-8");
        PrintWriter out = res.getWriter();

        String usernameOrEmail = req.getParameter("usernameOrEmail");
        String password        = req.getParameter("password");

        User user = userDAO.login(usernameOrEmail, password);

        if (user != null) {
            HttpSession session = req.getSession();
            session.setAttribute("userId", user.getId());
            session.setAttribute("firstName", user.getFirstName());
            session.setAttribute("email", user.getEmail());

            String firstName = user.getFirstName();
            if (firstName != null) {
                firstName = firstName.replace("'", "\\'");
            }

            out.println("<script>");
            out.println("localStorage.setItem('currentUser', JSON.stringify({");
            out.println("  firstName: '" + firstName + "',");
            out.println("  isLoggedIn: true");
            out.println("}));");
            out.println("alert('Login successful');");
            out.println("window.location = 'Home.html';");
            out.println("</script>");

        } else {
            out.println("<script>alert('Invalid Username/Email or Password');");
            out.println("window.location='index.html';</script>");
        }
    }
}
