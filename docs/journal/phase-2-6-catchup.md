I went a stretch without writing journal entries; not because I wasn’t working, but because some days didn’t feel “big” enough to document. Looking back, though, the progress has been steady and meaningful.

I wrapped up the storefront with a full component library, cart, checkout form, search/filter, and Storybook for component testing. I also added a auth skeleton for login and registration flows. I deployed the API to Render and switched to Supabase for the Postgres database. That change alone saved me from having to run a local Docker container on my laptop, which was getting cumbersome. Supabase has made development noticeably smoother.

I also connected the storefront to the database and am close to finishing the full UI‑to‑API integration. Stripe is set up with a webhook to handle payments, which checks off another major piece of the system.

I decided to use Resend rather than SparkPost for my email client. After some research it seems SparkPost is no longer the best option for my project. I have implemented customer order confirmation emails and admin new order emails. I will implement the status update email in phase 8, once I build out the admin panel. 

While updating the documentation, I shifted the timeline from a week‑based structure to a phase‑based one. Reviewing everything made me realize I had overlooked a few important steps—like building the admin panel and fully wiring the API to the frontend. Restructuring the plan forced me to go back, fill in the gaps, and correct those oversights.

Overall, even with the pauses in journaling, the project is moving forward with clarity and purpose.