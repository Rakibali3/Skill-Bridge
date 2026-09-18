package com.SkillBridge.skillbridge.service;

import com.SkillBridge.skillbridge.ExceptionHandling.SkillAlreadyExistsException;
import com.SkillBridge.skillbridge.ExceptionHandling.SkillNotFoundException;
import com.SkillBridge.skillbridge.dto.AdminSkillRequestDto;
import com.SkillBridge.skillbridge.entity.Skill;
import com.SkillBridge.skillbridge.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {
    private final SkillRepository skillRepository;

    public Skill createSkill(AdminSkillRequestDto request) {

        String name = request.getName().trim();
        String category = request.getCategory().trim();

        if (skillRepository.findByNameIgnoreCase(name).isPresent()) {
            throw new SkillAlreadyExistsException("A skill with this name already exists");
        }

        Skill skill = Skill.builder()
                .name(name)
                .category(category)
                .active(true)
                .build();

        return skillRepository.save(skill);
    }

    @Transactional(readOnly = true)
    public List<Skill> getAllSkills() {
        return skillRepository.findAllByOrderByNameAsc();
    }

    public Skill updateSkill(Long id, AdminSkillRequestDto request) {

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new SkillNotFoundException("Skill not found"));

        String name = request.getName().trim();
        String category = request.getCategory().trim();

        skillRepository.findByNameIgnoreCase(name)
                .ifPresent(existingSkill -> {

                    if (!existingSkill.getId().equals(id)) {
                        throw new SkillAlreadyExistsException("A skill with this name already exists");
                    }
                });

        skill.setName(name);
        skill.setCategory(category);

        return skillRepository.save(skill);
    }

    public void deactivateSkill(Long id) {

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new SkillNotFoundException("Skill not found"));

        skill.setActive(false);
        skillRepository.save(skill);
    }

    public void activateSkill(Long id) {

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new SkillNotFoundException("Skill not found"));

        skill.setActive(true);
        skillRepository.save(skill);
    }
}
