import * as React from 'react';
import { history } from '../services';

interface MenuState
{
    showMenu: boolean
}

export default class Menu extends React.Component<{}, MenuState>
{
    public constructor(props: any)
    {
        super(props);

        this.state = {
            showMenu: false
        };

        this.onShowMenu = this.onShowMenu.bind(this);
        this.onCloseMenu = this.onCloseMenu.bind(this);
        this.onDevices = this.onDevices.bind(this);
        this.onConnectToNew = this.onConnectToNew.bind(this);
    }

    private onShowMenu(event: React.MouseEvent<HTMLElement>): void
    {
        event.preventDefault();
        
        this.setState({
            showMenu: true
        });
    }

    private onCloseMenu(event: React.FocusEvent<HTMLElement>): void
    {
        var currentTarget = event.currentTarget;

        setTimeout(() => 
        {
            if (!currentTarget.contains(document.activeElement))
            {
                this.setState({
                    showMenu: false
                });
            }
        }, 0);
    }

    private onDevices(event: React.MouseEvent<HTMLElement>): void
    {
        event.preventDefault();

        history.push('/devices');
    }

    private onConnectToNew(event: React.MouseEvent<HTMLElement>): void
    {
        event.preventDefault();

        history.push('/connect');
    }

    public render(): React.ReactNode
    {
        const { showMenu } = this.state;

        // Render the props on the combobox -- Make sure there is no issue with map on empty array
        return (
            <div onBlur={this.onCloseMenu} tabIndex={0}>
                <button onClick={this.onShowMenu}> Menu </button>
                
                {showMenu && <div className="menu">
                                <div>
                                    <button onClick={this.onDevices}> My Devices </button>
                                </div>
                                <div>
                                    <button onClick={this.onConnectToNew}> Connect to New Device </button>
                                </div>
                            </div>}
            </div>
        )
    }
}