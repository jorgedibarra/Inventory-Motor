package com.project.backend.domain;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Category {
    private int categoryId;
    private String name;
    private boolean active;

}
