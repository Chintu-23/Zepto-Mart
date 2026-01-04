package com.zeptomart.servlet;

import com.zeptomart.dao.UserDAO;
import com.zeptomart.model.User;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;

public class RegisterServlet extends HttpServlet {

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

        String firstName = req.getParameter("firstName");
        String lastName  = req.getParameter("lastName");
        String email     = req.getParameter("email");
        String password  = req.getParameter("password");
        String dobStr    = req.getParameter("dateOfBirth");

        Date dob = null;
        if (dobStr != null && !dobStr.isEmpty()) {
            dob = Date.valueOf(dobStr); // yyyy-MM-dd
        }

        if (userDAO.emailExists(email)) {
            out.println("<script>alert('Email already registered. Please login.');");
            out.println("window.location='index.html';</script>");
            return;
        }

        User user = new User(firstName, lastName, email, password, dob);
        boolean ok = userDAO.registerUser(user);

        if (ok) {
            out.println("<script>alert('Signup successful! Please login.');");
            out.println("window.location='index.html';</script>");
        } else {
            out.println("<script>alert('Signup failed. Try again.');");
            out.println("window.location='Sign_up.html';</script>");
        }
    }
}
