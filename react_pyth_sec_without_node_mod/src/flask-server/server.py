import time
from flask import Flask, request, jsonify

import requests
import ipaddress
import subprocess

from selenium import webdriver
from selenium.webdriver.common.proxy import Proxy, ProxyType

app = Flask(__name__)


def open_with_proxy(url, proxy):
    try:
        proxy_settings = Proxy()
        proxy_settings.proxy_type = ProxyType.MANUAL
        proxy_settings.http_proxy = proxy['http']
        # proxy_settings.ssl_proxy = proxy['https']

        browser_options = webdriver.ChromeOptions()
        browser_options.add_argument('--proxy-server=%s' % proxy['http'])
        # browser_options.add_argument('--proxy-server=%s' % proxy['https'])
        driver = webdriver.Chrome(options=browser_options)

        driver.get(url)
        
        time.sleep(3600)  

        input("Press Enter to close the browser...")
        driver.quit()
        print("Done:")
        return jsonify({'message': 'IP address changed successfully'})

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return jsonify({'message': f"{str(e)}"}), 500

# "gateway=192.168.106.254",
def change_local_ip(interface_name, new_ip):
    try:
        # Disable the network interface
        subprocess.run(["netsh", "interface", "set", "interface", interface_name, "admin=disable"])

        # Change the IP address
        subprocess.run(["netsh", "interface", "ip", "set", "address", "name=", interface_name,  "source=static", f"address={new_ip}", "mask=255.255.254.0"])

        # Enable the network interface
        subprocess.run(["netsh", "interface", "set", "interface", interface_name, "admin=enable"])

        return True
    except Exception as e:
        print(f"Error changing local IP address: {str(e)}")
        return False

@app.route('/change_ip', methods=['POST'])
def change_ip():
   
    # interface_name = "Realtek PCIe GBE Family Controller"  
  
    proxy_url=request.json.get('proxy_url')
    proxy_port=request.json.get('proxy_port')
    url=request.json.get('url')

    try:
        proxies = {
                'http': f'http://{proxy_url}:{proxy_port}',
                # 'https': f'https://{proxy_url}:{proxy_port}'
            }
    

        # verify=False,
        # response = requests.get("http://primebpo.com",proxies=proxies)
        # print(response.text)
        # new_ip_address = ipaddress.IPv4Address('192.168.106.29')
        # string_ip_address = str(new_ip_address)

        # subprocess.run(['ifconfig', 'eth0', string_ip_address],shell=True)

        open_with_proxy(url, proxies)
        
        # return jsonify({'message': 'IP address changed successfully'})

        # if change_local_ip("Ethernet", proxy_url):
        #     print("Local IP address changed successfully")
        #     return jsonify({'success': proxy_url})
        # else:
        #     print("Failed to change local IP address")
        #     return jsonify({'success': 'wo2'})



        return jsonify({'success': True})

    except Exception as e:
        
        return jsonify({'message': f"{str(e)}"}), 500

    
if __name__ == '__main__':
    app.run(debug=False)