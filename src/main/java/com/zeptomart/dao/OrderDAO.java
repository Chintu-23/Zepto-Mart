package com.zeptomart.dao;

import com.zeptomart.util.DBUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class OrderDAO {

    public boolean saveOrder(String userName, String userEmail, String items, double totalAmount) {
        
        String sql = "INSERT INTO orders (user_name, user_email, items, total_amount) VALUES (?, ?, ?, ?)";

        try (Connection con = DBUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, userName);
            ps.setString(2, userEmail);
            ps.setString(3, items);          
            ps.setDouble(4, totalAmount);

            int rows = ps.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
