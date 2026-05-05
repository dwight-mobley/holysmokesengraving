Admin Dashboard Work
Spent today expanding the admin dashboard and made a small but important refactor along the way. I switched product deletion over to a safe‑delete pattern so order items always maintain a valid product reference. After that, most of the updates were straightforward CRUD additions.

Order Filtering Improvements
Implemented server‑side filtering for orders. It’s probably more than this project strictly needs right now, but it matches the filtering system already in place for products and gives the dashboard more room to scale later.

POS System Build‑Out
The POS system ended up being more involved than I originally expected, but the final result is solid. During checkout, the system generates a QR code that customers can scan to open a Stripe Checkout session. Once the payment is completed, the admin dashboard receives the update and inventory is adjusted automatically. I also added an option to email a receipt to the customer. For now, it uses the same template as online orders, though I may revise it later since the shipping fields are blank for POS transactions.

Next Steps
Functionality‑wise, the system is nearly wrapped up. Remaining tasks include finishing the gallery and a few static pages. I also want to add support for taking custom orders in person, which will require accepting an uploaded image and collecting shipping details. These aren’t critical right now, but they’ll be good enhancements for future iterations.