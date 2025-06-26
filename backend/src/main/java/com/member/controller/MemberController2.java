package com.member.controller;


import com.member.config.JwtUtil;
import com.member.dto.MemberDTO;
import com.member.entity.Member;
import com.member.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:3000") // React(프론트엔드)에서 접근 허용
@RestController // REST 방식의 컨트롤러임을 선언
@RequestMapping("/api/members") // 이 컨트롤러는 /api/members로 시작하는 요청 처리
@RequiredArgsConstructor // 생성자 자동 주입
@Log4j2
public class MemberController2 {

    private final MemberService memberService; // 서비스 레이어 주입

    private final JwtUtil jwtUtil;
    // 전체 회원 목록 조회 (페이징 + ID 내림차순 정렬)
    @GetMapping
    public Page<MemberDTO> list(@RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "3") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return memberService.readAllPage(pageable).map(this::toDTO);
    }

    // 회원 한 명 조회 (상세보기)
    @GetMapping("/{id}")
    public MemberDTO read(@PathVariable Long id) {
        return toDTO(memberService.read(id));
    }

    // 회원 등록
    @PostMapping
    public ResponseEntity<Void> create(@RequestBody MemberDTO dto) {
        memberService.register(toEntity(dto));
        return ResponseEntity.ok().build(); // 성공 응답 (200)
    }

    //  회원 수정
//    @PutMapping("/{id}")
//    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody MemberDTO dto) {
//        dto.setId(id); // 경로의 id를 DTO에 설정
//        memberService.register(toEntity(dto));
//        return ResponseEntity.ok().build();
//    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody MemberDTO dto, HttpServletRequest request) {
        dto.setId(id);

        // JWT 토큰에서 사용자 이름 추출
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build();
        }

        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromToken(token); // jwtUtil 주입 필요

        Member existing = memberService.read(id);

        if (!existing.getCreatedBy().equals(username)) {
            return ResponseEntity.status(403).build(); // 작성자가 아니면 권한 없음
        }

        dto.setCreatedBy(username); // 작성자 정보 다시 설정
        memberService.register(toEntity(dto));
        return ResponseEntity.ok().build();
    }



    // 회원 삭제
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> delete(@PathVariable Long id) {
//        memberService.delete(id);
//        return ResponseEntity.ok().build();
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).build(); // 인증 안됨
        }

        String token = authHeader.substring(7);
        String username = jwtUtil.getUsernameFromToken(token);

        Member existing = memberService.read(id);
        if (!existing.getCreatedBy().equals(username)) {
            return ResponseEntity.status(403).build(); // 작성자 아님
        }

        memberService.delete(id);
        return ResponseEntity.ok().build();
    }



    //  Entity → DTO 변환
    // 서버(DB에서 꺼낸 자바 Entity 객체)를 → 클라이언트(React)가 받을 수 있게 JSON 형태로 응답을 주기 위해 DTO로 변환
    private MemberDTO toDTO(Member member) {
        return new MemberDTO(
                member.getId(),
                member.getName(),
                member.getAge(),
                member.getPhone(),
                member.getAddress(),
                member.getCreatedBy()
        );
    }

    // DTO → Entity 변환
    // 클라이언트(React)가 보낸 JSON 데이터를 → 서버에서 처리하기 위해 DTO로 받고 → DB 저장용 Entity 객체로 변환
    public Member toEntity(MemberDTO dto) {
        return Member.builder()
                .id(dto.getId())
                .name(dto.getName())
                .age(dto.getAge())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .createdBy(dto.getCreatedBy())
                .build();
    }
}
