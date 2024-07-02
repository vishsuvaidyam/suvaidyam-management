// Copyright (c) 2024, vishwajeet and contributors
// For license information, please see license.txt

frappe.ui.form.on("Beneficiary", {

// first and last frm fuction
    first_name: function(frm) {
        update_student_full_name(frm);
    },
    last_name: function(frm) {
        update_student_full_name(frm);
    },


    // validation/////////////////////////
    validate: function(frm) {

        //     if (!frm.doc.registration_number) {
        //     frappe.msgprint(__('Registration Number is required'));
        //     frappe.validated = false;
        // } else {
        //     // Implement custom validation logic as per your requirements
        //     if (!isValidRegistrationNumber(frm.doc.registration_number)) {
        //         frappe.msgprint(__('Invalid Registration Number format'));
        //         frappe.validated = false;
        //     }
        // }

            //  email validation
            let email = frm.doc.email;
            // Regular expression for validating an email
            let email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email_regex.test(email)) {
                frappe.msgprint(__('Invalid email format'));
                frappe.validated = false;
            }

        
        var aadharNumber = frm.doc.addhar_number;
        // console.log("Aadhar Number: ", aadharNumber);   
        var aadharRegex = /^\d{12}$/;
        if (aadharNumber && !aadharRegex.test(aadharNumber)) {
            frappe.msgprint(__('Aadhar card number must be 12 digits and contain only numbers.'));
            frappe.validated = false;
        }

        // Pan validation
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const pan = frm.doc.pan_no;
        // console.log("Pan Number",pan)
        if (pan && !panRegex.test(pan)) {
            frappe.msgprint(__('Invalid PAN Number. Please enter a valid PAN.'));
            frappe.validated = false;
        }
        
    },

    // input Placeholder///////////////////////////////
    onload: function(frm) {
        frm.fields_dict['first_name'].df.placeholder = 'Enter Your Name';
        frm.fields_dict['last_name'].df.placeholder = 'Enter Your Name';
        frm.fields_dict['class'].df.placeholder = 'Enter Your Class';
        frm.fields_dict['roll_number'].df.placeholder = 'Enter Your Roll';
        frm.fields_dict['student_full_name'].df.placeholder = 'Enter Your Full Name';
        
        frm.fields_dict['father_name'].df.placeholder = 'Enter Your Father Name';
        frm.fields_dict['mother_name'].df.placeholder = 'Enter Your Mother Name';

        frm.fields_dict['email'].df.placeholder = 'Enter Your Email';
        frm.fields_dict['addhar_number'].df.placeholder = 'Enter Your Aadhar Number';
        frm.fields_dict['pan_no'].df.placeholder = 'Enter Your PAN Number';
        
        frm.refresh_field('first_name');
        frm.refresh_field('email');
        frm.refresh_field('addhar_no');
        frm.refresh_field('pan_no');
    },
       
	refresh(frm) {
        get_validate()
        // state dependent district
        frm.fields_dict["district"].get_query = function (doc) {
            if(doc.state){
                return {
                    filters: {
                      state: doc.state,
                    },
                    page_length: 1000
                  };
            }else{
                return {
                    filters: {  state: "please select state" }
                  };
            }
          },
          
           // district dependent block
            frm.fields_dict["block"].get_query = function (doc) {
                
                // console.log(doc);
                if (doc.district) {
                    return {
                        filters: {
                            district_name: doc.district
                        },
                        // page_length: 1000
                    };
                } else {
                    return {
                        filters: {
                            district_name: "please select district"
                        }
                    };
                }
            };
    
             // block dependent village_council
          frm.fields_dict["village_panchaayat"].get_query = function (doc) {
            if(doc.block){
                return {
                    filters: {
                        block_name: doc.block,
                    },
                    page_length: 1000
                  };
            }else{
                return {
                    filters: {  block_name: "please select block" }
                  };
            }
          };

            // village_council dependent  village
          frm.fields_dict["village_name"].get_query = function (doc) {
            if(doc.village_panchaayat){
                return {
                    filters: {
                        council_name: doc.village_panchaayat,
                    },
                    page_length: 1000
                  };
            }else{
                return {
                    filters: {  council_name: "please select block" }
                  };
            }
          };

           // village dependent  ward_no
          frm.fields_dict["ward_no"].get_query = function (doc) {
            if(doc.village_name){
                return {
                    filters: {
                        villagew: doc.village_name,
                    },
                    page_length: 1000
                  };
            }else{
                return {
                    filters: {  villagew: "please select Village" }
                  };
            }
          };
	},

    // click in mt value state /////////////////////////////////////////////////////
    state:function(frm){
        frm.fields_dict["district"].get_query = function (doc) {
            if(doc.state){
                return {
                    filters: {
                      state: doc.state,
                    },
                    page_length: 1000
                  };
            }else{
                return {
                    filters: {  state: "please select state" }
                  };
            }
            
          }
          frm.set_value('district','')
        },

      // click in mt value  district///////
        district:function(frm){

            frm.fields_dict["block"].get_query = function (doc) {
                
                // console.log(doc);
                if (doc.district) {
                    return {
                        filters: {
                            district_name: doc.district
                        },
                        // page_length: 1000
                    };
                } else {
                    return {
                        filters: {
                            district_name: "please select district"
                        }
                    };
                }
            }
            frm.set_value("block",'')
        },

            // click in mt value  block///////
        block:function(frm){
            frm.fields_dict["village_council"].get_query = function (doc) {
                if(doc.block){
                    return {
                        filters: {
                            block_name: doc.block,
                        },
                        page_length: 1000
                      };
                }else{
                    return {
                        filters: {  block_name: "please select block" }
                      };
                }
              };

            frm.set_value("village_council",'')
        },

        
            // click in mt value  village_council///////
        village_council:function(frm){
            frm.fields_dict["village_name"].get_query = function (doc) {
                if(doc.village_council){
                    return {
                        filters: {
                            council_name: doc.village_council,
                        },
                        page_length: 1000
                      };
                }else{
                    return {
                        filters: {  council_name: "please select block" }
                      };
                }
              }
              frm.set_value("village_name",'')
        },

     // click in mt value  village_name///////
        village_name:function(frm){

          frm.fields_dict["ward_no"].get_query = function (doc) {
            if(doc.village_name){
                return {
                    filters: {
                        villagew: doc.village_name,
                    },
                    page_length: 1000
                  };
            }else{
                return {
                    filters: {  villagew: "please select Village" }
                  };
            }
          }
          frm.set_value("ward_no",'')
        },
});

// first name and last name =fullname
function update_student_full_name(frm) {
    if (frm.doc.first_name && frm.doc.last_name) {
        frm.set_value('student_full_name', frm.doc.first_name + " " + frm.doc.last_name);
    } else {
        frm.set_value('student_full_name', frm.doc.first_name || frm.doc.last_name || '');
    }
}
