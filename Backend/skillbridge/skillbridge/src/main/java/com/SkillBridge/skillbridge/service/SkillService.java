package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.ExceptionHandling.AuthenticatedUserNotFoundException;
import com.SkillBridge.skillbridge.dto.SkillRequestDto;
import com.SkillBridge.skillbridge.dto.SkillResponseDto;
import com.SkillBridge.skillbridge.entity.Skill;
import com.SkillBridge.skillbridge.entity.User;
import com.SkillBridge.skillbridge.entity.UserSkill;
import com.SkillBridge.skillbridge.enums.SkillType;
import com.SkillBridge.skillbridge.repository.SkillRepository;
import com.SkillBridge.skillbridge.repository.UserRepository;
import com.SkillBridge.skillbridge.repository.UserSkillRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SkillService {
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;


    public SkillResponseDto addSkill(Authentication authentication, @Valid SkillRequestDto skillRequestDto) {
       User user = getAuthenticatedUser(authentication);
        String skillName = skillRequestDto.getSkillName().trim();

        Skill skill = skillRepository.findByNameIgnoreCase(skillName)
                .orElseGet(() -> skillRepository.save(Skill.builder().name(skillName).build()));

        boolean isSkillExist = userSkillRepository.existsByUserIdAndSkillIdAndSkillType(
                user.getId(),
                skill.getId(),
                skillRequestDto.getSkillType()
        );
        if(isSkillExist){
            throw new RuntimeException("You have already added this skill");
        }

        UserSkill userSkill = UserSkill.builder()
                .user(user)
                .skill(skill)
                .skillType(skillRequestDto.getSkillType())
                .level(skillRequestDto.getLevel())
                .experience(skillRequestDto.getExperience())
                .description(skillRequestDto.getDescription())
                .learningGoal(skillRequestDto.getLearningGoal())
                .build();

        UserSkill saved = userSkillRepository.save(userSkill);

        return convertToResponse(saved);

    }

    @Transactional(readOnly = true)
    public List<SkillResponseDto> getSkills(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return userSkillRepository.findByUserId(user.getId()).stream().map(this::convertToResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<SkillResponseDto> getTeachingSkills(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        return userSkillRepository.findByUserIdAndSkillType(user.getId(),SkillType.TEACH)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SkillResponseDto> getLearningSkills(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        return userSkillRepository.findByUserIdAndSkillType(user.getId(),SkillType.LEARN)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public SkillResponseDto updateSkill(Authentication authentication,
                                        @Valid SkillRequestDto skillRequestDto, Long id) {

        User user = getAuthenticatedUser(authentication);
        UserSkill userSkill = userSkillRepository.findByIdAndUserId(id,user.getId()).orElseThrow(()
                -> new RuntimeException("Skill not found"));

        String skillName = skillRequestDto.getSkillName().trim();

        Skill skill = skillRepository.findByNameIgnoreCase(skillName).orElseGet(()
                -> skillRepository.save(Skill.builder().name(skillName).build()));

        userSkill.setSkill(skill);
        userSkill.setSkillType(skillRequestDto.getSkillType());
        userSkill.setLevel(skillRequestDto.getLevel());
        userSkill.setExperience(skillRequestDto.getExperience());
        userSkill.setDescription(skillRequestDto.getDescription());
        userSkill.setLearningGoal(skillRequestDto.getLearningGoal());

        UserSkill updated = userSkillRepository.save(userSkill);

        return convertToResponse(updated);
    }

    public void deleteSkill(Authentication authentication, Long id) {
        User user = getAuthenticatedUser(authentication);

        UserSkill userSkill =  userSkillRepository.findByIdAndUserId(id,user.getId()).orElseThrow(()->
                new RuntimeException("Skill not found"));

        userSkillRepository.delete(userSkill);

    }

    private User getAuthenticatedUser(Authentication authentication) {
        String Email = authentication.getName();
        return userRepository.findByEmailIgnoreCase(Email).orElseThrow(()->
                new AuthenticatedUserNotFoundException("Authenticated User Not Found"));
    }
    private SkillResponseDto convertToResponse(UserSkill userSkill) {
        return SkillResponseDto.builder()
                .id(userSkill.getId())
                .skillId(userSkill.getSkill().getId())
                .skillName(userSkill.getSkill().getName())
                .category(userSkill.getSkill().getCategory())
                .skillType(userSkill.getSkillType())
                .level(userSkill.getLevel())
                .experience(userSkill.getExperience())
                .description(userSkill.getDescription())
                .learningGoal(userSkill.getLearningGoal())
                .build();
    }

}
