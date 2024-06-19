using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace server.Dtos
{
    public class UserDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}