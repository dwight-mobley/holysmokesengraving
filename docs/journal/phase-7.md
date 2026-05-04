Phase 7 brought a few unexpected challenges, but it also pushed the project into a more mature and scalable direction. I made the decision to adjust the system design by introducing a dedicated user table that the customer table can join against. This shift came from choosing to implement role‑based authentication, which aligns much better with industry standards than relying solely on an API key. I kept API key authentication available as a fallback for testing and for tools like Postman, but the primary flow now follows a more secure and conventional model.

On the frontend, I integrated Jose to verify JWTs client‑side. This gives users a smoother experience by avoiding unnecessary server round‑trips just to confirm token validity. Even with that improvement, I still added manual verification checks on the dashboard for an extra layer of security.

I also implemented the first version of the user dashboard. It’s intentionally simple right now—showing the user’s order history and basic profile information, but it establishes the foundation for future enhancements. I plan to expand this so users can update their profile, manage account details, and submit inquiries tied to specific orders.

Another improvement this phase was adding a post‑checkout prompt encouraging customers to create an account after a successful order. This should help convert more guest checkouts into registered users and strengthen the overall ecosystem.

Overall, Phase 7 was a mix of architectural refinement and UX upgrades, and it moved the project meaningfully closer to a production‑ready state.