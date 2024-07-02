import frappe
from frappe import _
from frappe.model.document import Document
from frappe.utils import now
from datetime import datetime

class AttendanceLog(Document):  
    pass
#  Attendance Checkin
@frappe.whitelist()
def check_in(user):
    # Check if user already has an open check-in record
    if frappe.db.exists("Attendance Log", {"user": user, "check_out": None}):
        frappe.throw(_("User has already checked in but not checked out. Please check out first."))

    # Get current time in 12-hour format with AM/PM
    check_in_time = datetime.now().strftime('%I:%M:%S %p')

    # Create a new attendance log document
    new_log = frappe.get_doc({
        "doctype": "Attendance Log",
        "user": user,
        "check_in": check_in_time,
        "status": "Present"
    })

    try:
        new_log.insert()
        frappe.db.commit()  # Ensure changes are saved to the database
    except Exception as e:
        frappe.db.rollback()  # Rollback in case of any error
        frappe.throw(_("An error occurred while checking in: {0}").format(str(e)))

    # Return success message with log details
    return {
        "message": {
            "log_name": new_log.name,
            "user": user,
            "check_in": check_in_time
        }
    }
#  Attendance Checkout
@frappe.whitelist()
def check_out(user):
    from datetime import datetime

    try:
        # Fetch the attendance log where the user has not checked out yet
        logs = frappe.get_all("Attendance Log", filters={"user": user, "check_out": ["is", "set"]}, limit=1)
        
        if logs:
            log = logs[0]
            log_doc = frappe.get_doc("Attendance Log", log.name)
            
            # Set the check_out time to now
            check_out_time = datetime.now()
            log_doc.check_out = check_out_time
            log_doc.save(ignore_permissions=True)
            
            # Format the check_out time to 24-hour format with AM/PM
            formatted_check_out = datetime.now().strftime('%I:%M:%S %p')
            
            # Return the check out time and user
            return {
                "check_out": formatted_check_out,
                "user": user
            }
        else:
            # Handle the case where there is no log to check out
            return {
                "message": "No check-in record found for the user."
            }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Check Out Error")
        return {
            "message": "An error occurred during check-out. Please try again.",
            "error": str(e)
        }

    #  Attendance details in checkin  in custom Html
@frappe.whitelist()
def user_details(user):
    LastDoc = frappe.get_last_doc('Attendance Log', filters={"user": user})
    return LastDoc

