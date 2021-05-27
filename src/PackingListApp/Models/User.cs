using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PackingListApp.Models
{
    public class User
    {
        /// <summary>
        /// User Id
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// User name
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

    public enum AdminType
    {
        Normal,
        Vip,
        King
    }
}
