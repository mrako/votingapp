Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.provider :libvirt do |domain, override|
    domain.random_hostname = true
    override.vm.synced_folder ".", "/vagrant", type: "nfs"
  end

  config.vm.provision :ansible do |ansible|
    ansible.playbook = "ansible/provision.yml"
    ansible.host_key_checking = false
  end
end
