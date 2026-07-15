# Emil Design Engineering Skill

> Skills for Design Engineers to build better user interfaces with animations and motion design.

## When to Use

- Building or reviewing animations
- Implementing transitions and micro-interactions
- Designing motion systems
- Reviewing UI/UX for animation opportunities
- Creating fluid, Apple-like interfaces

## Core Skills

### emil-design-eng

The main skill for animation and design advice. Covers:

- Easing functions (ease-in vs ease-out)
- Duration principles
- Physicality in motion
- Interruptibility
- Performance optimization
- Accessibility considerations

### review-animations

Strict review of animations based on design principles:

- Purpose & frequency
- Easing & duration
- Physicality
- Interruptibility
- Performance
- Accessibility
- Cohesion
- Missed opportunities

### improve-animations

Audit all animations in your codebase:

- Prioritized findings table
- Self-contained execution plans
- Category-based analysis
- Hotspot identification

### find-animation-opportunities

Search UI for places that would benefit from motion:

- Identify animation candidates
- Identify what NOT to animate
- Prioritize by impact

### animation-vocabulary

Get better animations by using the right words:

- Precise motion terminology
- Clearer communication with AI
- Consistent animation language

### apple-design

Apple's principles for interface design:

- Fluid motion
- WWDC design talks distilled
- Web-applicable principles

## Animation Principles

### Easing

- **Enter animations**: Use `ease-out` (decelerate)
- **Exit animations**: Use `ease-in` (accelerate)
- **Movement**: Use `ease-in-out` (accelerate then decelerate)

### Duration

- **Micro-interactions**: 100-200ms
- **Page transitions**: 200-400ms
- **Complex animations**: 400-800ms
- **Never exceed**: 1000ms

### Physicality

- Animations should feel physical
- Use spring physics for natural motion
- Consider mass and friction
- Avoid robotic, linear motion

### Interruptibility

- Animations should be interruptible
- Users should be able to cancel mid-animation
- Transition smoothly from current state

### Performance

- Use `transform` and `opacity` only
- Avoid animating layout properties
- Use `will-change` sparingly
- Test on lower-end devices

### Accessibility

- Respect `prefers-reduced-motion`
- Provide alternatives for critical animations
- Don't rely solely on animation for feedback

## Implementation Checklist

When adding animations:

- [ ] **Purpose**: Does this animation serve a purpose?
- [ ] **Easing**: Is the easing appropriate for the action?
- [ ] **Duration**: Is the duration appropriate?
- [ ] **Physicality**: Does it feel natural?
- [ ] **Interruptibility**: Can it be interrupted?
- [ ] **Performance**: Is it performant?
- [ ] **Accessibility**: Does it respect motion preferences?

## Review Questions

1. Does this animation have a clear purpose?
2. Is the easing function appropriate?
3. Is the duration within recommended ranges?
4. Does the animation feel physical and natural?
5. Can the animation be interrupted?
6. Is the animation performant?
7. Does it respect `prefers-reduced-motion`?
