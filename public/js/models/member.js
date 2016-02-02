app.factory('member', function(){
	
	function Member(id, username, password, status) {
    // Public properties, assigned to the instance ('this')
    this.id = id;
    this.username = username;
    this.password = password;
    this.status = status;
  }

  Member.prototype.isOnline = function()
  {
    if(this.status !== 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  };


  return Member;
});