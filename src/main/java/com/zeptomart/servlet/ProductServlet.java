package com.zeptomart.servlet;

import com.google.gson.Gson;
import com.zeptomart.dao.ProductDAO;
import com.zeptomart.model.Product;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/products")
public class ProductServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private ProductDAO productDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        productDAO = new ProductDAO();
        gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {

        res.setContentType("application/json;charset=UTF-8");

        List<Product> products = productDAO.getAllProducts();

        String json = gson.toJson(products);

        PrintWriter out = res.getWriter();
        out.write(json);
        out.flush();
    }
}
