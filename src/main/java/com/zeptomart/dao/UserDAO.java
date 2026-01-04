package com.zeptomart.dao;

import com.zeptomart.model.User;
import com.zeptomart.util.DBUtil;

import java.sql.*;

public class UserDAO {

    public boolean emailExists(String email) {
        String sql = "SELECT id FROM users WHERE email = ?";
        try (Connection con = DBUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }

        } catch (SQLException e) {
            e.printStackTrace();
            return false; // on error, treat as not existing (simplified)
        }
    }

    public boolean registerUser(User user) {
        String sql = "INSERT INTO users (first_name, last_name, email, password, date_of_birth) " +
                     "VALUES (?,?,?,?,?)";

        try (Connection con = DBUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, user.getFirstName());
            ps.setString(2, user.getLastName());
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getPassword()); // plain text for demo
            if (user.getDateOfBirth() != null) {
                ps.setDate(5, user.getDateOfBirth());
            } else {
                ps.setNull(5, Types.DATE);
            }

            int rows = ps.executeUpdate();
            return rows > 0;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public User login(String usernameOrEmail, String password) {
        String sql = "SELECT id, first_name, last_name, email, date_of_birth " +
                     "FROM users WHERE (email = ? OR first_name = ?) AND password = ?";

        try (Connection con = DBUtil.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, usernameOrEmail);
            ps.setString(2, usernameOrEmail);
            ps.setString(3, password);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    User u = new User();
                    u.setId(rs.getInt("id"));
                    u.setFirstName(rs.getString("first_name"));
                    u.setLastName(rs.getString("last_name"));
                    u.setEmail(rs.getString("email"));
                    u.setDateOfBirth(rs.getDate("date_of_birth"));
                    u.setPassword(password); // not really needed here
                    return u;
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null; // invalid credentials
    }
}
