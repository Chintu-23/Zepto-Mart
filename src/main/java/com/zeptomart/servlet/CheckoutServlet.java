package com.zeptomart.servlet;

import com.zeptomart.dao.OrderDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/checkout")
public class CheckoutServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private OrderDAO orderDAO;

    @Override
    public void init() throws ServletException {
        orderDAO = new OrderDAO();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");
        res.setContentType("text/html;charset=UTF-8");
        PrintWriter out = res.getWriter();

        HttpSession session = req.getSession(false);
        if (session == null) {
            out.println("<script>alert('Please login before placing an order.');");
            out.println("window.location='index.html';</script>");
            return;
        }

        // 👇 name + email from LoginServlet session
        String userName  = (String) session.getAttribute("firstName");
        String userEmail = (String) session.getAttribute("email");

        if (userName == null || userEmail == null) {
            out.println("<script>alert('User details missing. Please login again.');");
            out.println("window.location='index.html';</script>");
            return;
        }

        // From hidden inputs in Home.html (JS already sending only names)
        String items      = req.getParameter("itemsJson");
        String totalStr   = req.getParameter("totalAmount");

        if (items == null || items.isEmpty() ||
            totalStr == null || totalStr.isEmpty()) {

            out.println("<script>alert('Invalid order data.');");
            out.println("window.location='Home.html';</script>");
            return;
        }

        double totalAmount;
        try {
            totalAmount = Double.parseDouble(totalStr);
        } catch (NumberFormatException e) {
            out.println("<script>alert('Invalid total amount.');");
            out.println("window.location='Home.html';</script>");
            return;
        }

        // 👉 new signature: (userName, userEmail, items, totalAmount)
        boolean ok = orderDAO.saveOrder(userName, userEmail, items, totalAmount);

        if (ok) {
            out.println("<script>");
            out.println("alert('Order placed successfully!');");
            out.println("window.location='Home.html';");
            out.println("</script>");
        } else {
            out.println("<script>alert('Failed to place order. Try again.');");
            out.println("window.location='Home.html';</script>");
        }
    }
}
