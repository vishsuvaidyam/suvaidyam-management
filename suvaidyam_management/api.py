@frappe.whitelist()
def get_logged_user():
	return frappe.session.user