using PackingListApp.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.DTO
{
    public class NewUserModel
    {
        /// <summary>
        /// First Name
        /// </summary>
        [Required]
        [MaxLength(64)]
        public string FirstName { get; set; }
        /// <summary>
        /// User LastName
        /// </summary>
        [Required]
        [MaxLength(64)]
        public string LastName { get; set; }
        /// <summary>
        /// User Address
        /// </summary>
        [Required]
        [MaxLength(128)]
        public string Address { get; set; }

        [Required]
        [MaxLength(10)]
        public string Description { get; set; }

        [Required]
        public bool IsAdmin { get; set; }

        public AdminType? AdminType { get; set; }


    }
}
