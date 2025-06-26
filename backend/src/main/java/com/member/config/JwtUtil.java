package com.member.config;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private static final String SECRET_KEY = "mysecretkeymysecretkeymysecretkey1234"; // 최소 256bit
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1시간

    private final Key key; //  타입 명시

    public JwtUtil() {
        this.key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes()); // 키 생성
    }
    // 발급 시간과 만료 시간을 로그로 출력

    // JWT 토큰 생성
    public String createToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        // 로그 출력
        System.out.println("토큰 발급 시간: " + now);
        System.out.println("토큰 만료 시간: " + expiryDate);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)            // 위에서 생성한 now 사용
                .setExpiration(expiryDate)   // 위에서 생성한 expiryDate 사용
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // JWT 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 토큰에서 사용자 이름 추출
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
