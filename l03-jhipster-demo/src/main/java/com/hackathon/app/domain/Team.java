package com.hackathon.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Team.
 */
@Entity
@Table(name = "team")
public class Team implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "team")
    @JsonIgnore
    private Set<Member> members = new HashSet<>();

    @OneToMany(mappedBy = "team")
    @JsonIgnore
    private Set<Project> projects = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Team name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Member> getMembers() {
        return members;
    }

    public Team members(Set<Member> members) {
        this.members = members;
        return this;
    }

    public Team addMembers(Member member) {
        members.add(member);
        member.setTeam(this);
        return this;
    }

    public Team removeMembers(Member member) {
        members.remove(member);
        member.setTeam(null);
        return this;
    }

    public void setMembers(Set<Member> members) {
        this.members = members;
    }

    public Set<Project> getProjects() {
        return projects;
    }

    public Team projects(Set<Project> projects) {
        this.projects = projects;
        return this;
    }

    public Team addProjects(Project project) {
        projects.add(project);
        project.setTeam(this);
        return this;
    }

    public Team removeProjects(Project project) {
        projects.remove(project);
        project.setTeam(null);
        return this;
    }

    public void setProjects(Set<Project> projects) {
        this.projects = projects;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Team team = (Team) o;
        if (team.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, team.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Team{" +
            "id=" + id +
            ", name='" + name + "'" +
            '}';
    }
}
